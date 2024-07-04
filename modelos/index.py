import pandas as pd
import matplotlib.pyplot as plt
from pmdarima import auto_arima
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

data = pd.read_csv('sample_data/output.csv')


data['dateTime'] = pd.to_datetime(data['dateTime'])
data.set_index('dateTime', inplace=True)


data.columns = ['current', 'voltage']


data['energy_consumption'] = data['current'] * data['voltage']


print(data.head())
print(data.shape)


columns_to_plot = ['current', 'voltage', 'energy_consumption']
for column in columns_to_plot:
    plt.figure(figsize=(10, 6))  
    plt.plot(data.index, data[column], label=column)  
    plt.title(f'Gráfico de {column}')  
    plt.xlabel('Data e Hora')  
    plt.ylabel('Valor')  
    plt.legend()  
    plt.grid(True)  
    plt.tight_layout()  
    plt.show()



start_p = 0
start_q = 0
max_p = 3
max_q = 2
m = 12

d = 2
D = 1

stepwise_model = auto_arima(data['energy_consumption'],
                            start_p=start_p, start_q=start_q,
                            max_p=max_p, max_q=max_q, m=m,
                            start_P=2, seasonal=True,
                            d=d, D=D, trace=True,
                            error_action='ignore',
                            suppress_warnings=True,
                            stepwise=True)

print("AIC:", stepwise_model.aic())
print("Parâmetros do Melhor Modelo:", stepwise_model.order, stepwise_model.seasonal_order)



train_start, train_end = '2024-07-20 12:00:00', '2024-07-20 12:30:00'
test_start, test_end = '2024-07-20 12:30:00', '2024-07-20 13:00:00'


train = data.loc[train_start:train_end, 'energy_consumption']
test = data.loc[test_start:test_end, 'energy_consumption']


stepwise_model.fit(train)


future_forecast = stepwise_model.predict(n_periods=45)


future_forecast = pd.DataFrame(future_forecast, index=test.index, columns=["Prediction"])


plt.figure(figsize=(20, 12))

plt.plot(train, label='Treino', color='blue')
plt.plot(test, label='Teste', color='green')
plt.plot(future_forecast, label='Previsão', color='red')

plt.xlabel('Data e Hora')
plt.ylabel('Consumo de Energia')
plt.title('Treino, Teste e Previsão')
plt.legend()


plt.xlim(pd.Timestamp('2024-07-20 12:30:00'), pd.Timestamp('2024-07-20 12:35:00'))
plt.grid(True)
plt.show()