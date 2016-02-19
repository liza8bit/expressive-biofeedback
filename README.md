# Instructions
1. Make sure the Muse headset is paired with your computer via Bluetooh.

2. ```npm install```

3. ```npm start```

4. Open a browser and go to http://localhost:3000

5. Press the 'Connect to Muse' button to connect to Muse and start streaming data. Note that Muse may take a second before it starts streaming proper data, so just wait if you first see a flat line.

6. If you find that Muse keeps disconnecting, check to make sure there aren't any additional Muse processes that may not have stopped properly from previous runs, i.e. ```ps aux | grep 'muse-io'```