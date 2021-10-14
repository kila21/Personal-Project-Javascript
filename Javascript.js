class Transaction {
  constructor() {
    this.store = {};
    this.logs = [];
  }
  dispatch(scenario) {
    this.scenario = scenario.sort((a, b) => a.index - b.index);
    this.scenario.forEach((value) => {
      if (
        value.index &&
        value.meta &&
        value.meta.title &&
        value.meta.description &&
        value.call
      ) {
      } else {
        throw new Error(
          "Scenario  needs 'index, meta, title, description, call' fields"
        );
      }
    });
    (async () => {
      for (const value of scenario) {
        let log = {};
        log.index = value.index;
        log.meta = value.meta;
        log.storeBefore = this.store;
        log.error = null;

        try {
          await value.call(this.store);
          log.storeAfter = this.store;
          this.logs.push(JSON.parse(JSON.stringify(log)));
        } catch (err) {
          //   console.log(err.name);
          if (typeof value.restore !== "undefined") {
            try {
              log.error = {};
              log.error.name = err.name;
              log.error.message = err.message;
              await value.restore(this.store);
              log.error.info = "This step have no restor error";
              log.storeAfter = value.restore(this.store);
              this.logs.push(JSON.parse(JSON.stringify(log)));
            } catch (resError) {
              log.error = {};
              log.error.name = resError.name;
              log.error.message = resError.message;
              log.error.info = "This step have restor error.";
              delete log.storeBefore;
              this.logs.push(JSON.parse(JSON.stringify(log)));
              console.log(this.logs);
              // rollback
              let reversLogsNum = this.logs.length - 2;
              for (reversLogsNum; reversLogsNum >= 0; reversLogsNum--) {
                // console.log(this.logs[reversLogsNum].error);
                let index = this.logs[reversLogsNum].index;
                for (let i of this.scenario) {
                  if (i.index === index) {
                    if (this.logs[reversLogsNum].error === null) {
                      //   console.log(i.index);
                      try {
                        await i.restore(this.store);
                        this.logs[reversLogsNum].error =
                          "firstly call succesfull, than restored";
                      } catch (e) {
                        this.logs[reversLogsNum].error =
                          "firstly call succesfull, than restored Error";
                        // throw new Error("restore failed");

                        throw new Error(
                          `Restore failed : ${e.message} with index ${i.index}`
                        );
                      }
                    }
                  }
                }
                console.log(this.logs[reversLogsNum]);
              }
              break;
            }
          }
        }
        // this.logs.push(JSON.parse(JSON.stringify(log)));
      }
      //   console.log(this.logs);
    })();
  }
}

const scenario = [
  {
    index: 1,
    meta: {
      title: "Read popular customers",
      description:
        "This action is responsible for reading the most popular customers",
    },
    // callback for main execution
    call: async (store) => {
      //   throw new Error("some erro");
      return store;
    },
    // callback for rollback
    restore: async (store) => {
      //   throw new Error("restore1 error");
      return store;
    },
  },
  {
    index: 30,
    meta: {
      title: "Delete customer",
      description: "This action is responsible for deleting customer",
    },
    // callback for main execution
    call: async (store) => {
      throw new TypeError("some errror");
      //   return store;
    },
    // callback for rollback
    restore: async (store) => {
      //   return store;
      throw new Error("restore2 error");
    },
  },

  {
    index: 25,
    meta: {
      title: "Delete customer",
      description: "This action is responsible for deleting customer",
    },
    // callback for main execution
    call: async (store) => {
      throw new TypeError("some errror");
    },
    // callback for rollback
    restore: async (store) => {
      return store;
      //   throw new Error("restore2 error");
    },
  },
];

const transaction = new Transaction();

(async () => {
  try {
    await transaction.dispatch(scenario);
    const store = transaction.store; // {} | null
    const logs = transaction.logs; // []/
    // console.log(logs);
  } catch (err) {
    // log detailed error
    // const errors = [];
    // let error = {
    //   name: err.name,
    //   message: err.message,
    //   track: err.track,
    // };
    // errors.push(error);
    console.log(err);
  }
})();
