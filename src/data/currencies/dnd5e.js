export default {
  name: "D&D 5th edition",
  currencies: [
    {
      'name': 'GP',
      'conversionRate': 10,
    },
    {
      'name': 'SP',
      'conversionRate': 10,
    },
    {
      'name': 'CP'
    }
  ],
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