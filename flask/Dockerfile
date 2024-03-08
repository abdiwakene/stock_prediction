FROM python:3.10

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt 

COPY . /app

EXPOSE 5000

ENV FLASK_APP=app.py 
ENV FLASK_RUN_HOST=0.0.0.0

ENTRYPOINT [ "python3" ]
CMD ["app.py"]