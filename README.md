# Forex EUR-USD App

## Project Objectives
This project was a team effort to build and deploy an application analyzing foreign exchange (_"forex"_) rates against the U.S. Dollar, focusing on the Euro (**€**) to U.S. Dollar (**$**) market. This analysis would incorporate Machine Learning techniques, 2018 & 2019 EUR-USD forex data, and financial/political news sentiment analyses. Utilizing these, we would then a create and train varying models that would achieve accuracies capable of being profitable. The goal of these models would be to implement a high frequency trading strategies, taking long and short positions over a span of ten minutes.

#### Project Status: Complete

### Methods
* ETL
* Application Deployment
* Financial & Economic News Sentiment Analysis
* Predictive Modeling
* Machine Learning
    * Random Forrest
    * Neural Networks
    * Deep Learning
* Data Visualization

### Technologies
* Python 
    * Jupyter Notebook/Lab
    * TensorFlow
    * Keras
    * Scikit
    * Pandas
    * NumPy
    * Time
    * Requests
    * Natural Language Toolkit
    * API Interactions
    * Matplotlib
* Heroku
    * Python
    * Flask
* JavaScript
    * Flask
    * Plot.ly
    * D3
* HTML
    * Bootstrap
    * CSS
* Excel

## Project Description
(Provide more detailed overview of the project.  Talk a bit about your data sources and what questions and hypothesis you are exploring. What specific data analysis/visualization and modelling work are you using to solve the problem? What blockers and challenges are you facing?  Feel free to number or bullet point things here)

The EUR-USD forex market data for 2018 and 2019 was gathered from [HistData.com](https://www.histdata.com/download-free-forex-data/) as the data could be downloaded in CSV format on a minute-by-minute basis. After doing so, the data was cleaned and re-formatted into a homogenized layout for easy interchangeable loading into the models. A small inconvenience occurred when as the 2019 data was not posted as one CSV file, but multiple files due to only being 3/4 through the year. This required an extra step of concatenating the multiple files but was also completed. 

The sentiment analysis data was pulled from [New York Time Developers](https://developer.nytimes.com/) using API interactions to pull article abstracts for daily news. The topics pulled using this API include finance, business, and political, and would be sorted into subject specific categories: finance, politics, and federal reserve bank. This news would be analyzed utilizing a Python Library, Natural Language Toolkit, to give each article abstract a score: negative, neutral, positive, and compound. These scores would be based on the sentiment of the words inside the article. This data would be used inside the models to determine if news had any effect on exchange rates between currencies. 

With the data ready, many Machine Learning models were created, trained, and tested using the tools listed under technologies. The models would analyze 20 to 60 points of moving averages to determine various predictive patterns for the next ten minutes of the forex data. The sentiment analysis was disregarded during this process as it was ineffectual on the models' results and even diminishing of model accuracy. A final model, Neural Networks, was chosen as it was able to achieve the highest accuracy, 60% to 70%, and for demonstration purposes, December 2018 was chosen as it had the highest number of results per month. An issue arose from deciding how this would be implemented in the frontend, but was decided for presentation purposes an excel file would be more reliable and easier to implement.

In the frontend development, the team resourced a template to use for the wire-frame of the site (License to use this template owned by [Lawrence Ferretti](https://github.com/lferretti)). This template was then modified to our needs, preferences, and custom-built pages in HTML.

The interactive page implemented the bulk of the JavaScript coding as it shows how the model would interact with Live Data if this data was being pulled directly from the forex market on a minute-by-minute basis. This faced some issues as to making historical data appear as if it was live data, and complicated app deployment as the historical data needed to be loaded through Python Flask.

After the frontend was completed, the site was first tested using flask locally and then deployed via [Heroku]().

## Project Requirements

- Frontend Development
- ETL Processing
- Machine Learning Modeling
- Advanced Data Analysis

## Lauching The App Locally

1. Clone This Repo To A Local File

2. Under the App Folder, use command line (or alternative) to either run the shell script _run_ : sh run.sh

    * Alternative: Using GitBash, under the App/forex_app folder, launch the app.py: python app.py

3. Next, in your preferred web browser type _127.0.0.1:5000_ into the URL.

## Featured Notebooks/Analysis/Deliverables
* [Heroku App](link)

## Contributing Members

|Name     | GitHub Profile |
|---------|----------------|
| Lawrence Ferretti | https://github.com/lferretti |
| Julian Freeman | https://github.com/jofreeman1014 |
| Chris Holt | https://github.com/chrisholt0222 |
| Jack Lindsay | https://github.com/Trippl7777 |
| Jason Ree | https://github.com/jjree |
| Alex Wolf | https://github.com/AlexMattWolf |

