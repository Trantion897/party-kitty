export default {
  name: "D&D 5th edition",
  currencies: ['GP', 'SP', 'CP'],
  conversionRates: [10, 10],
  specialCurrencies: [
    {
      'name': 'PP',
      'convertsTo': 'GP',
      'conversionRate': 10,
      'enableConversion': 'ask',
      'enableGeneration': 'no',
    },
	{
      'name': 'EP',
      'convertsTo': 'SP',
      'conversionRate': 5,
      'enableConversion': 'ask',
      'enableGeneration': 'no',
    }
  ],
}