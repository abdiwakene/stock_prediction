Build and run container
1. docker build -t flask_api .
2. docker run -d -l 5000:5000 flask_api
3. curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d '{"symbol":"AAPL"}'