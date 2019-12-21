const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const playerInfo = {
  name : ""
}

readline.question('Kiu estas vi? ', (name) => {
  console.log('Saluton ' + name + '!')
  playerInfo.name = name
  readline.close()
})
