# Random stuff

## Random parser

## Live match prediction
Initially, we wanted to do live match predictions. 
We could get this data via the [GOTV protocol](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Broadcast) 
(essentially, it's demo files but live streamed) but 
finding these broadcasts and understanding/integrating the protocol proved to be very time consuming.

Ultimately, we decided to pivot and not do live predictions.

## Custom demofile parser (Rust)

At the start we wanted to create a custom demoparser. Since the graviton hackathon is mainly focused around the **new** graviton cpus 
that are more powerful and cost less, it looked like a good idea to create a custom parser by which we could test these claims.

Unfortunately while building we noticed creating a custom parser would be very time consuming. The demo files are very complex and 
not well documented. But in general we did not want to remove the code and show our effort. 

