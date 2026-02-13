#!/usr/bin/env bash
set -e

cd server
npm install --omit=dev
npm start
