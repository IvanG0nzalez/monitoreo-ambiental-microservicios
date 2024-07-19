const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = "Endpoint=sb://ihsuprodblres098dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=cucugScc6Sqgn1RUnSYTWhyOaSM06I8K2AIoTJ0FJqk=;EntityPath=iothub-ehub-esp32-aula-61406321-ffcf723c4b";
const consumerGroup = "$Default";
const deviceId = "ESP32-MAIN";

async function main() {
    console.log("Starting event monitor, filtering on device:", deviceId);

    const client = new EventHubConsumerClient(consumerGroup, connectionString);

    client.subscribe({
        processEvents: async (events, context) => {
            for (const event of events) {
                if (event.systemProperties["iothub-connection-device-id"] === deviceId) {
                    console.log(JSON.stringify(event.body));
                }
            }
        },
        processError: async (err, context) => {
            console.error(err.message);
        }
    });

    console.log("Use Ctrl-C to stop...");
}

main().catch((err) => {
    console.error("Error running sample:", err.message);
});