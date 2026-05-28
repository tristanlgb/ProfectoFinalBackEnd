import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Load environment variables from .env
    ConfigModule.forRoot(), 
    // Setup Mongoose with async configuration to access env variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Connecting to MongoDB with URI:', uri); // Log to verify the URI being used
        console.log('MONGODB_URI from env:', process.env.MONGODB_URI); // Directly log the env value
        return { uri };
      },
      inject: [ConfigService],
    }),
    // Import application modules
    ProductsModule,
    CartsModule,
    UsersModule,
      AuthModule,
  ],
})
export class AppModule {}
