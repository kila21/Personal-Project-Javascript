import {validation,logs} from "./import";

class Transaction {
  scenario: Array<validation>;
  store: object = {};
  logs: Array<logs>;
  constructor() {
  this.store = {};
  this.logs = [];
  };

  dispatch(scenario:Array<any>): void {
    this.scenario = scenario.sort((a, b) => a.index - b.index);
    (async () => {
      for (const scene of scenario) {
        let log: logs = {
          index: scene.index,
          meta: scene.meta,
          storeBefore: this.store,
          error: null,
        }
        try {
          await scene.call(this.store)
          log.storeAfter = this.store;
          this.logs.push(JSON.parse(JSON.stringify(log)))
        }catch (err) {
          if(typeof scene.restore !== "undefined") {
            try {
              await scene.restore(this.store);
              log.error = {
                name: err.name,
                message: err.message,
                info: "This step have no restore error",
              };
              log.storeAfter = scene.restore(this.store);
              this.logs.push(JSON.parse(JSON.stringify(log)))
            }catch (resError) {
                log.error = {
                  name: resError.name,
                  message: resError.message,
                  info: "This step have restore error",
                }
                delete log.storeBefore;
                this.logs.push(JSON.parse(JSON.stringify(log)))
                //rollback
                let reversLogsNum: number = this.logs.length - 2;
                for (reversLogsNum; reversLogsNum >= 0; reversLogsNum--) {
                  let index: number = this.logs[reversLogsNum].index;
                  for(let i of this.scenario){
                    if(i.index === index) {
                      if(this.logs[reversLogsNum].error === null) {
                        try{
                          await i.restore(this.store);
                          this.logs[reversLogsNum].error = "firstly call successful,than restored"
                        }catch(e){
                          this.logs[reversLogsNum].error = "firstly call successful, than restored error"
                          throw new Error(`Restore failed: ${e.message} with index ${i.index}`)
                        }

                      }
                    }
                  }
                  console.log(this.logs[reversLogsNum])
                }
                this.store = null;
                break;
            }
          }
        }

      }
    })()
  }
}

const scenario: Array<validation> = [
  {
    index: 1,
    meta: {
      title: "Read popular customers",
      description:
        "This action is responsible for reading the most popular customers",
    },
    // callback for main execution
    call: async (store: any) => {
      //   throw new Error("some error");
      return store;
    },
    // callback for rollback
    restore: async (store) => {
        // throw new Error("restore1 error");
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
      throw new TypeError("some error");
        // return store;
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
      throw new TypeError("some error");
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
    // const store = transaction.store; // {} | null
    // const logs = transaction.logs; // []/
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

