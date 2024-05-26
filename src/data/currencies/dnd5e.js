export default {
  name: "D&D 5th edition",
  currencies: [
    {
      'name': 'GP',
      'fullName': 'Gold',
      'colour': '#e19d1e',
      'conversionRate': 10,
    },
    {
      'name': 'SP',
      'fullName': 'Silver',
      'colour': '#a6a09a',
      'conversionRate': 10,
    },
    {
      'name': 'CP',
      'fullName': 'Copper',
      'colour': '#b57b66'
    }
  ],
  specialCurrencies: [
    {
      'name': 'PP',
      'fullName': 'Platinum',
      'colour': '#bcbcbc',
      'convertsTo': 'GP',
      'conversionRate': 10,
      'enableConversion': 'ask',
      'enableGeneration': 'no',
    },
	{
      'name': 'EP',
      'fullName': 'Electrum',
      'colour': '#8fa2af',
      'convertsTo': 'SP',
      'conversionRate': 5,
      'enableConversion': 'ask',
      'enableGeneration': 'no',
    }
  ],
}