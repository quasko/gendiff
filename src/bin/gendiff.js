#!/usr/bin/env node
import { program } from '..';

program
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);
