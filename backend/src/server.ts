import { app } from './app';
import { db } from './config/db';
import { env } from './config/env';

// Check if the required variables are defined
if (!env.JWT_SECRET) {
    console.error('❌ ERROR: JWT_SECRET no está definido');
    process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to the database
        await db.getConnection(); // Get a connection from the pool
        console.log('✅ Database connected');
    
        app.listen(PORT, () => {
            console.log('════════════════════════════════════════');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log('════════════════════════════════════════');
        });
        
    } catch (error) {
        console.error('❌ Error starting server:', error);
        // Exit the process with an error code
        process.exit(1);
    }
};

startServer();