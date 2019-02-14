#!/usr/bin/env node
import commander from 'commander';
import compareFiles from '..';

commander
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format', 'text')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(compareFiles(firstConfig, secondConfig, commander.format));
  })
  .parse(process.argv);
