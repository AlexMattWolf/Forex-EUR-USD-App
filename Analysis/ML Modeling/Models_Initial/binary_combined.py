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
def CNN(d, f):
    from keras.utils import to_categorical
    y = to_categorical(f)
    
    model = Sequential()
    model.add(Dense(units=50, activation='relu', input_dim=d.shape[1]))
    model.add(Dense(units=50, activation='relu'))
    model.add(Dense(units=y.shape[1], activation='softmax'))
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    model.fit(d, y, epochs=5, shuffle=True, verbose=0)
    return model

# Get Data
def getdata(hour, month):
    df = pd.read_csv('series.csv')
    cols5 = ['21', '22', '23', '24', '25']
    cols10 = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
    df['sum5'] = df[cols5].sum(axis=1)
    df['sum10'] = df[cols10].sum(axis=1)
    d = df[(df['hour'] == hour) & (df['month'] == month)].copy()
    del df
    d['labels'] = d['sum10'].apply(setlabels)
    return d

# get Profit
def getprofit(train,test,month):
    # Get X, y for model
    data = getdata(train, month)
    X = data.iloc[:,8:28].to_numpy()
    le = fit_le(data['labels'])
    y_encoded = le.transform(data['labels'])

    # Fit models
    kmn = KMEANS(data)
    rfc = RFC(X, y_encoded)
    svm = SV(X, y_encoded)
    cnn = CNN(X, y_encoded)

    # Set Kmeans groups on testdata
    data["grp"] = kmn.labels_
    data_group = data.groupby('grp').agg(['sum','count', 'min', 'max'])
    buygroup = data_group['labels'][['sum']].idxmax()[0]
    sellgroup = data_group['labels'][['sum']].idxmin()[0]

    # Set KMEANS buy and sell group
    def setkmeans(x):
        if x == sellgroup:
            return -1
        elif x == buygroup:
            return 1
        else:
            return 0
    
    del data
    del X
    del y_encoded

    # Pull test data and make predictions
    testdata = getdata(test,month)
    formodel = testdata.iloc[:,8:28].to_numpy()
    testdata['grp'] = kmn.fit_predict(formodel)
    testdata["kmn"] = testdata["grp"].apply(setkmeans)
    testdata['rf'] = le.inverse_transform(rfc.predict(formodel))
    testdata['svm'] = le.inverse_transform(svm.predict(formodel))
    testdata['cnn'] = le.inverse_transform(cnn.predict_classes(formodel))
    testdata['abs'] = testdata['kmn'].abs() + testdata['rf'].abs() + testdata['svm'].abs() + testdata['cnn'].abs()
    testdata = testdata.drop(testdata[(testdata['abs'] == 0)].index)
    testdata['tot'] = testdata['kmn'] + testdata['rf'] + testdata['svm'] + testdata['cnn']
    testdata = testdata.drop(testdata[(testdata['tot'] == -1)].index)
    testdata = testdata.drop(testdata[(testdata['tot'] == 0)].index)
    testdata = testdata.drop(testdata[(testdata['tot'] == 1)].index)

    # Calc profit based on 'tot' column
    totalrows = testdata.shape[0]
    totalcols = testdata.shape[1]
    profit = []
    for i in range(totalrows):      
        if (testdata.iloc[i,totalcols-1] < -1):
            temp = -testdata['sum10'].iloc[i]
        else:
            temp = testdata['sum10'].iloc[i]
        
        profit.append(temp)

    del testdata
    return sum(profit)

p = []
for i in range(21):
    d = getprofit(i,i+2,1)
    print("Profit " + str(i) + " : " + str(d))
    p.append(d)

print("Profit Avg: " + str(sum(p) /10))

