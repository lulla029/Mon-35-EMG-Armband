import serial
import asyncio
import websockets
import time
 
try:
    ser = serial.Serial('COM6', 115200, timeout=1)
    time.sleep(2) 
    print("connected to Arduino")
except Exception as e:
    print(f"Error:{e}")
 
async def handler(websocket):
    print("Website connected to bridge!")
    while True:
        while ser.in_waiting > 0:
            data = ser.readline().decode('utf-8').strip()
            print(data) 
            await websocket.send(data)
        await asyncio.sleep(0.01)  
 
async def main():
    print("Bridge is running on COM5... Refresh your website!")
    async with websockets.serve(handler, "localhost", 8081):
        await asyncio.Future()
 
if __name__ == "__main__":
    asyncio.run(main())