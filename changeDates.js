const fs = require("fs")
const moment = require("./lib/moment.js")

const origin = fs.readFileSync("FUTURE.md", "utf8")

const originalLines = origin.split(/\r?\n/)

const regex = /# Day \d\d - ([A-Z][a-z]+ \d+) - .*\(.+\)/

for(const line of originalLines){
  const match = line.match(regex)
  if(match){
    console.log(line)
  }
}

console.log(moment())