from flask import Flask, request, jsonify
from pymongo import MongoClient
import tensorflow as tf
import tempfile
import zipfile
import os
from datetime import datetime
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB connection details
uri = "mongodb+srv://api:apipassword123@stonks.rhtscww.mongodb.net/stonks?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client['stonks']
lookback = 30
forecast = 5

@app.route('/', methods=['GET'])
def health_check():
    return 'Services up and running.'

@app.route('/predict', methods=['POST'])
def predict():


    if request.method == 'OPTIONS' :
        # Define the response to an OPTIONS request
        response = app.make_response(jsonify({'message': 'OPTIONS request handled'}))
        response.headers['Allow'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

        return response

    if request.method == 'POST':
        # ================================================================= get params
        data = request.json
        symbol = data.get('symbol')

        # ================================================================= fetch model
        # fetch zipped model
        coll_models = db['models']
        model_doc = coll_models.find_one({'model_name': f'model_{symbol}'})
        if not model_doc:
            return jsonify({'error': 'Model not found'}), 404
        
        # unzip and load model
        model_data = model_doc['model_data']
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, 'model.zip')
            with open(zip_path, 'wb') as zip_file:
                zip_file.write(model_data)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            # Load the model
            model = tf.keras.models.load_model(temp_dir)

        # ================================================================= fetch historical data
        # fetch from mongodb
        coll_historic = db['historical_stocks']
        docs = coll_historic.find({'symbol': symbol}).sort('date', -1).limit(30)

        # ================================================================= prep lookback data
        # subset symbol and sort by date ascending
        features_no_close = ['open', 'count', 'volume_weighted', 'low', 'high', 'volume']
        features = features_no_close + ['close']
        df_historical = pd.DataFrame(docs)
        df = df_historical[df_historical['symbol'] == symbol].sort_values('date')
        
        # normalize df
        scaler_features = MinMaxScaler(feature_range=(0,1))
        scaled_features = scaler_features.fit_transform(df[features_no_close])
        df_scaled_features = pd.DataFrame(scaled_features, columns=features_no_close, index=df.index)
        scaler_close = MinMaxScaler(feature_range=(0,1))
        scaled_close = scaler_close.fit_transform(df[['close']])
        df_scaled_close = pd.DataFrame(scaled_close, columns=['close'], index=df.index)
        df_scaled = pd.concat([df_scaled_features, df_scaled_close], axis=1)

        # ================================================================= predict
        # shape data
        X = np.array(df_scaled.values)
        X = np.reshape(X, (1, lookback, len(features)))

        # predict
        predictions = model.predict(X)
        predictions = scaler_close.inverse_transform(predictions)

        # ================================================================= return forecast
        # get next 5 business days
        last_date = df_historical['date'].max()
        next_5 = pd.bdate_range(start=last_date, periods=forecast+1, freq='B')[1:]

        # map forecast
        retDict = {
            'forecast': []
        }
        for i, date in enumerate(next_5):
            retDict['forecast'].append({
                'date': date.date().strftime('%Y-%m-%dT%H:%M:%SZ'),
                'price': predictions[0][i].item()
            })

        # return json
        return jsonify(retDict)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
