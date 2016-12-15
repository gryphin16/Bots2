var facebookAccounts = [ 
  {
	  "datr":"qjQcV7M2NA7rnaF_gzIti49g",
	  "c_user":"100011868053476",
	  "xs":"245%3Atl3BeUFiG4HVRQ%3A2%3A1461466304%3A-1"
	  
  },
  {
	  "datr":"NyARV-s7YoGJ7cH8j3bLmuOc",
	  "c_user":"100011749817307",
	  "xs":"123%3AQlJUCb8BxWdsaQ%3A2%3A1460740178%3A-1"}];
var AgarioClient = require('agario-client');
extend = require("extend");

function facebookManager() {
    this.activeAccounts = [];
    this.usedAccounts = [];
    this.accounts = [];
}
facebookManager.prototype.generateTokens = function(settings, callback) {
    /*
     * Object   Options:
     * 
     * Boolean  owned;      default: false;
     * Boolean  maxMass;    default: false;
     * Int      minLevel;   default: 0;
     * Int      maxLevel;   default: 100;
     */
    defaultOptions = {
        owned: false,
        maxMass: false,
        minLevel: 0,
        maxLevel: 100
    };
    options = defaultOptions;
    if (typeof settings != "undefined") {
        options = extend(options, settings);
        console.log(options);
    }
    var manager = this;
    console.log("generating tokens...");
    if (this.accounts.length < 1) {
        console.log("NO ACCOUNTS TO GENERATE TOKEN");
    }
    var amountOfAccounts = this.accounts.length;
    var amountOfTriedAccounts = 0;
    //    var loopIndex = 0;
    this.accounts.map(function(cookie) {
        //skip facebook accounts that are not owned by me 
        //if we want only facebook accounts that are mine
        if (typeof cookie.owned != "undefined" && options.owned && !cookie.owned) return;

        //skip facebook accounts that are not the maximum reachable mass
        if (typeof cookie.lvl != "undefined" && options.maxMass && cookie.lvl < 34) return;

        //skip facebook accounts that are lower than this level
        if (typeof cookie.lvl != "undefined" && cookie.lvl < options.minLevel) return;

        //skip facebook accounts that are higher than this level
        if (typeof cookie.lvl != "undefined" && cookie.lvl > options.maxLevel) return;


        var account = new AgarioClient.Account();

        //Login through facebook on http://agar.io/ and copy cookies c_user,datr,xs from http://www.facebook.com/ here
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;
        //        setTimeout(function () {
        //Request token
        account.requestFBToken(function(token, info) {
            if (token) {
                manager.activeAccounts.push({
                    cookie: cookie,
                    token: token
                });
                console.log("TOTAL TOKENS:", manager.activeAccounts.length);
            } else {
                console.log('Failed to get token!', cookie.c_user);
            }
            newAccountValidated();
        });
        //    },500 * loopIndex);
        //        loopIndex++;
    });

    function newAccountValidated() {
        amountOfTriedAccounts++;

        if (amountOfAccounts == amountOfTriedAccounts) {
            if (typeof callback == "function") {
                callback();
            }
        }
    }
};

facebookManager.prototype.generateToken = function(singleAccount) {
    var manager = this;
    [singleAccount].map(function(cookie) {
        var account = new AgarioClient.Account();

        //Login through facebook on http://agar.io/ and copy cookies c_user,datr,xs from http://www.facebook.com/ here
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;

        //Request token
        account.requestFBToken(function(token, info) {
            if (token) {
                console.log('Got new token: ' + token);
                manager.activeAccounts.push(token);
                console.log("");
                console.log("TOTAL TOKENS:", manager.activeAccounts.length)
                console.log("");
            } else {
                console.log('Failed to get token!', cookie.c_user);
                if (info.error)
                    console.log('Request error: ' + info.error);
                if (info.res && info.res.statusCode)
                    console.log('HTTP code: ' + info.res.statusCode);
                if (info.res && info.res.headers && info.res.headers.location)
                    console.log('Redirect: ' + info.res.headers.location);
                console.log("retrying");
                manager.generateToken(cookie);
                //if(info.data) console.log('HTML: ' + info.data);
            }
        });

    });
};
facebookManager.prototype.setAccounts = function(accounts) {
    this.accounts = accounts;
}

facebookManager.prototype.hasAvailableToken = function() {
    if (this.activeAccounts.length > 0) {
        return true;
    }
    return false;
}

facebookManager.prototype.getToken = function() {
    var account = this.activeAccounts.pop();
    this.usedAccounts.push(account);
    return account.token;
};
facebookManager.prototype.returnToken = function(token) {
    for (var i = 0; i < this.usedAccounts.length; i++) {
        if (this.usedAccounts[i].token === token) {
            this.activeAccounts.push(this.usedAccounts[i]);
            this.usedAccounts.splice(i, 1);
            return;
        }

    }
    throw "No used token found for: " + token;
}

var manager = new facebookManager();
manager.setAccounts(facebookAccounts);
module.exports = manager;