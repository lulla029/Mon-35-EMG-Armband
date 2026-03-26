import requests
import asyncio
import websockets

# This function bridges data from the ESP (HTTP) to the browser (WebSocket)
async def handler(websocket):
    while True:
        try:
            # Pull one reading from my sensor endpoint (served by the ESP)
            RES = requests.get("http://192.168.4.1/sensor")

            if RES.status_code == 200:
                data = RES.text            # raw sensor value as text
                print(f"Sensor: {data}")   # log it so I can see the stream
                await websocket.send(data) # push it to the web client
            else:
                # If the ESP replies but not OK, tell me the status code
                print(f"Server responds with status code: {RES.status_code}")

        except requests.ConnectionError:
            # If the ESP is down or Wi‑Fi hiccups
            print("Connection time out")

        # Small delay so I don't hammer the ESP (and to have control)
        await asyncio.sleep(0.01)

# Start a WebSocket server on localhost:8081 and keep it running forever
async def main():
    print("Bridge running on wifi... Refresh your website!")
    async with websockets.serve(handler, "localhost", 8081):
        await asyncio.Future()  # never resolves → keeps server alive

if __name__ == "__main__":
    asyncio.run(main())
