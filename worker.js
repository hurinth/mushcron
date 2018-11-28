const request = require('request')
const CronJob = require('cron').CronJob
const TZ = 'America/Costa_Rica'
const jobs = [];
let auto = false;

let sndr = (target, state='') => {
  return () => {
      request.post({
        uri: `https://maker.ifttt.com/trigger/${target}${state}/with/key/${process.env.IFTTT_KEY}`
      }, (err, res, body) => {
        console.log(`${target} ${state} - min: ${new Date().getMinutes()} - sec: ${new Date().getSeconds()} - Res Code: ${res.statusCode}`)
    })
  }
}

jobs.push(
  // INTAKE used to start in 8 and end in 5
  new CronJob('0 5-59/10 * * * *', sndr('intake', 'On'), null, false, TZ),
  new CronJob('0 4-59/10 * * * *', sndr('intake', 'Off'), null, false, TZ),
  // FOGGER used to start in 9 and end in 5
  new CronJob('0 0-59/10 * * * *', sndr('fogger', 'On'), null, false, TZ),
  new CronJob('30 8-59/10 * * * *', sndr('fogger', 'Off'), null, false, TZ),
  // EXHAUST
  new CronJob('45 7-59/20 * * * *', sndr('exhaust', 'On'), null, false, TZ),
  new CronJob('47 7-59/20 * * * *', sndr('exhaust', 'On'), null, false, TZ), //Backup on signal since often overlaps in time with the off signal
  new CronJob('0 8-59/1 * * * *', sndr('exhaust', 'Off'), null, false, TZ),
  // LEDs
  new CronJob('0 0  1,2,3,4,5,22,23 * * *', sndr('leds', 'On'), null, false, TZ),
  new CronJob('0 30 1,2,3,4,5,22,23 * * *', sndr('leds', 'Off'), null, false, TZ),
  // KEEPALIVE
  new CronJob('0-59/5 * * * *', sndr('keepalive'), null, false, TZ)
)   

exports.work = (command) => {
  if (command === 'start') {
    for (let job of jobs) {
      job.start()
    }
  } else if (command === 'stop') {
    for (let job of jobs) {
     job.stop()
    }
  }
}

exports.changeMode = (modeReq) => {
  if(modeReq.newMode === 'manual') {
    jobs[modeReq.device].stop()
    jobs[modeReq.device+1].stop()
  } else if (modeReq.newMode === 'auto') {
    jobs[modeReq.device].start()
    jobs[modeReq.device+1].start()
  }
}

exports.changeState = (stateReq) => {
  
    var action = sndr('intake', stateReq.newState)
    action()

}//