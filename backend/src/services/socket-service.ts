import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { findVacationPreferences } from "./groqService";
import { getAllVacations } from "./vacationService";  // Import the service to fetch vacations

export default function handleScketIO(httpServer: Server): void {
    const options = { cors: { origin: "*" } };
    const socketServer = new SocketServer(httpServer, options);

    socketServer.sockets.on("connection", async (socket: Socket) => {
        // Fetch vacations from the service
        const vacations = await getAllVacations();
        const vacationList = vacations.map(vacation => 
            `- ${vacation.destination} from ${vacation.start_date} to ${vacation.end_date}, price: $${vacation.price}`
        ).join("\n");

        socket.on("client-vacation", async (preferences: string) => {
            const aiResponse = await findVacationPreferences(preferences, vacationList);
            socket.emit("server-vacation", aiResponse);
        });
    });
}
