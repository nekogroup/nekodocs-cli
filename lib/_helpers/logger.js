import chalk from 'chalk'

export default {
  boldInfo: (...args) => {
    console.log(chalk.blue.underline.bold(...args))
    console.log('')
  },

  error: (...args) => {
    console.error(chalk.red.bold('ERROR----------------------'))
    console.error(chalk.red.bold(...args))
    console.error(chalk.red.bold('---------------------------'))
  },

  warn: (...args) => {
    console.log(chalk.yellow.bold(...args))
  },

  success: (...args) => {
    console.log(chalk.green(...args))
  },

  info: (...args) => {
    console.log(chalk.cyan(...args))
  },
}
