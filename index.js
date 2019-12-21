const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question('Kiu estas vi? ', (name) => {
  console.log('Saluton ' + name + '!')
  readline.close()
})
