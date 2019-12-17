# load dependencies
# import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC 
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from keras.utils import to_categorical

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Categorize the 'sum' column the number of PIPs over selected range
def setlabels(x):
    if x < -10:
        return -1
    elif x > 10:
        return 1
    else:
        return 0

def fit_le(y):
    label_encoder = LabelEncoder()
    return label_encoder.fit(y)

# Kmeans Model
def KMEANS(d):
    model = KMeans(n_clusters=20)
    model.fit(d)
    return model

# Random forrest model
def RFC(d,f):
    model = RandomForestClassifier(n_estimators=40)
    model.fit(d, f)
    return model

# SVM Model
def SV(d,f):
    model = SVC(kernel='poly',gamma='auto',C=.25)
    model.fit(d, f)
    return model

# Neural Network model
def CNN(d,f):
    from keras.utils import to_categorical
    y = to_categorical(f)
    
    model = Sequential()
    model.add(Dense(units=50, activation='relu', input_dim=d.shape[1]))
    model.add(Dense(units=50, activation='relu'))
    model.add(Dense(units=y.shape[1], activation='softmax'))
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    model.fit(d, y, epochs=1, shuffle=True, verbose=0)
    return model

# Get Data
def getdata():
    df = pd.read_csv('combined.csv')
    for i in range(30):
        colname = 'ma' + str(i+1)
        df[colname] = df.iloc[:,(i+8):(i+18)].sum(axis=1)

    df.drop(df.columns[91:100], axis=1, inplace=True)
    df.drop(df.columns[8:68], axis=1, inplace=True)
    df = df[df['hour'].isin([6,7])]
    df["labels"] = df["ma30"].apply(setlabels)

    return df

# get Profit
def getprofit(start):
    # Get X, y for model
   
    X = data.iloc[start:start+3000,8:31].to_numpy()
    y = y_encoded[start:start+3000]

    # Fit models
    #kmn = KMEANS(data)
    #rfc = RFC(X, y_encoded)
    #svm = SV(X, y_encoded)
    cnn = CNN(X, y)

    # Set Kmeans groups on testdata
    #data["grp"] = kmn.labels_
    #data_group = data.groupby('grp').agg(['sum','count', 'min', 'max'])
    #buygroup = data_group['labels'][['sum']].idxmax()[0]
    #sellgroup = data_group['labels'][['sum']].idxmin()[0]

    # Set KMEANS buy and sell group
    #def setkmeans(x):
    #    if x == sellgroup:
    #        return -1
    #    elif x == buygroup:
    #        return 1
    #    else:
    #        return 0
    
    #del data
    #del X
    #del y_encoded

    # Pull test data and make predictions
    testdata = data.iloc[start + 3100: start +4100,:].copy()
    formodel = testdata.iloc[:,8:31].to_numpy()
    
    testdata['class'] = le.inverse_transform(cnn.predict_classes(formodel))
    testdata = testdata.drop(testdata[(testdata['class'] == 0)].index)    

    # Calc profit based on 'tot' column
    totalrows = testdata.shape[0]
    #totalcols = testdata.shape[1]
    if (totalrows == 0):
        total = 0
    else:
        profit = []
        for i in range(totalrows):
            temp = testdata.iloc[i]['class'] * testdata.iloc[i]['ma30']
            profit.append(temp)
        total = sum(profit)

    del testdata
    return total


data = getdata()
le = fit_le(data['labels'])
y_encoded = le.transform(data['labels'])

results = []
for j in range(100):
    p = []
    numpred = 27
    for i in range(numpred):
        print('Here: ' + str(j) + " " + str(i))
        d = getprofit(i*1000)
        p.append(d)

    results.append(sum(p))

#for i in range(1000):
#    print("Results " + str(i) + " : " + str(results[i]))

print("Results Avg " + " : " + str(sum(results)/len(results)))

r = pd.DataFrame(results)
r.to_csv('sims.csv')
