![Logo](admin/mytkstar-gps.png)
# ioBroker.mytkstar-gps

[![NPM version](https://img.shields.io/npm/v/iobroker.mytkstar-gps.svg)](https://www.npmjs.com/package/iobroker.mytkstar-gps)
[![Downloads](https://img.shields.io/npm/dm/iobroker.mytkstar-gps.svg)](https://www.npmjs.com/package/iobroker.mytkstar-gps)
![Number of Installations](https://iobroker.live/badges/mytkstar-gps-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/mytkstar-gps-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.mytkstar-gps.png?downloads=true)](https://nodei.co/npm/iobroker.mytkstar-gps/)

**Tests:** ![Test and Release](https://github.com/BlackEdder0815/ioBroker.mytkstar-gps/workflows/Test%20and%20Release/badge.svg)

## mytkstar-gps adapter for ioBroker

Getting latest status of GPS-Tracker like TK911pro (for pets) or several other trackers supported by this vendor. All what you need is your tracker ID and the tracker password.

## Usage
Using the website mytkstar.net and simulating a login. Using the login-context to fetch the token information and store those information in ioBroker.

### Limitations
Currently only tested with TK911pro and the token-login(!). Should work with other tokens also.
Login with username is currently not supported.


## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**
-   minor bugfix

### 1.0.0 (2023-03-10)

-   Stabelized first version. Basic fetching of data is working.

## License
MIT License

Copyright (c) 2023 BlackEdder0815 <github@famsona.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.