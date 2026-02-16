import serial
import asyncio
import websockets

ser = serial.Serial('COM6', 115200) # Simple connection

async def handler(websocket):
    while True:
        if ser.in_waiting > 0:
            data = ser.readline().decode('utf-8').strip()
            await websocket.send(data)
        await asyncio.sleep(0.1) 

async def main():
    async with websockets.serve(handler, "localhost", 8081):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())