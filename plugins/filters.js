import Vue from 'vue'

Vue.filter('formatDate', (value) => {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
})
Vue.filter('formatDateTime', (value) => {
  return new Date(value)
    .toString('en-US', {
      timeZone: 'Asia/Kolkata',
    })
    .slice(4, 21)
})
Vue.filter('formatText', (value) => {
  const result = value.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
})
