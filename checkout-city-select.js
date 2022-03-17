window.customCheckout = window.customCheckout || {}

customCheckout.options = {
  countrySelector: document.querySelector('select[name="checkout[shipping_address][country]"'),
  citySelector: 'checkout_shipping_address_city',
  customAddressCountry: null,
  caret: document.querySelector('.field__caret').cloneNode(true)
}

customCheckout.initCitySelector = (options) => {
  options.cityField = document.querySelector(`#${options.citySelector}`)
  options.cityFieldOrig = options.cityField.cloneNode(true)
  console.log(options.caret)

  let currentCountry = options.countrySelector.value
  if (currentCountry === 'Australia') {
    options.customAddressCountry = 'Australia'
      customCheckout.citySelector(options)
  }
  options.countrySelector.addEventListener('change', e => customCheckout.handleCountryChange(e, options))
}

customCheckout.handleCountryChange = (e, options) => {
  switch (e.target.value) {
    case 'Australia':
options.customAddressCountry = 'Australia'
      break
    default: 
      options.customAddressCountry = null
  }


  customCheckout.citySelector(options)
}

customCheckout.citySelector = (options) => {
  const parent = options.cityField.parentNode
  let cityFields = [];

  switch (options.customAddressCountry) {
    case 'Australia': 
      cityFields = customCheckout.defineCitiesAustralia()
      break
    default:
      cityFields = null
  }

  if (cityFields){
      const select = customCheckout.createCitySelect(options, cityFields);

    parent.replaceChild(select, options.cityField)
      options.cityField = select;
      parent.appendChild(options.caret)
  } else {
    if (options.cityField !== options.cityFieldOrig){
    parent.replaceChild(options.cityFieldOrig, options.cityField)
      options.cityField = options.cityFieldOrig
      parent.removeChild(options.caret)
    }
  }
}

customCheckout.createCitySelect = (options, cityFields) => {
  let select = document.createElement('select'),
      attributes = options.cityField.attributes,
      placeholder = ''
  for (let attribute of attributes){
    if (attribute.nodeName !== "type" &&
       attribute.nodeName !== "size"){
      select.setAttribute(attribute.nodeName, attribute.nodeValue)
      if (attribute.nodeName === 'placeholder') placeholder = attribute.nodeValue
    }
  }
  select.classList.add('field__input--select')

  let option = document.createElement('option')
  option.setAttribute('disabled', true)
  option.textContent = placeholder;
  select.appendChild(option)
  for (let city of cityFields){
    let option = document.createElement('option')
      option.value = city.value
      option.textContent = city.label
      if (city.value === attributes.value.nodeValue){
        option.setAttribute('selected', true) 
      }
      select.appendChild(option)
  }
  console.log(select)
  return select
}


customCheckout.defineCitiesAustralia = () => {
  return [
    {value: 'Melbourne', label: 'Melbourne'},
    {value: 'Sydney', label: 'Sydney'},
    {value: 'Canberra', label: 'Canberra'}
  ]
}

customCheckout.runCheckoutCustomizations = () => {
  if (Shopify.Checkout.step === 'contact_information'){
    customCheckout.initCitySelector(customCheckout.options)
  }
}

document.addEventListener('page:load', customCheckout.runCheckoutCustomizations);
document.addEventListener('page:change', customCheckout.runCheckoutCustomizations);
