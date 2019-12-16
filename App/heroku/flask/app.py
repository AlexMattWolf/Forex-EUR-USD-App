import os
import pandas as pd
import flask
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

df_19 = pd.read_csv('data/2018_12_forex_sel.csv')
 
# CSV Imports
# ecbi_df = pd.read_csv("data/ECB_Interest Rates.csv")
# frbi_df = pd.read_csv("data/FRB_Interest Rates.csv")

# Base path
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/interactive")
def interactive():
    return render_template("interactive.html")

@app.route("/summary")
def summary():
    return render_template("Summary.html")


@app.route("/data")
def data():
    json_df = df_19.to_json(orient = 'records')
    return json_df


# @app.route("/data") # Necessary for the javascript, needs a data path to pull data from the csv!
# def dataset():
#     results = 

# For the Machine Learning path
# @app.route("/ml")
# def ml():
#     return render_template("index.html")

if __name__ == "__main__":
    app.run()
