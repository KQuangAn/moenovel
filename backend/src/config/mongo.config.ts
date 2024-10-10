import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongoConfiguration {
	private readonly logger = new Logger(MongoConfiguration.name);
	constructor(private configService: ConfigService) {}

	createMongooseOptions = () => {
		const mongodbUri = this.configService.get<string>('MONGODB_URI');
		const queryLoggingEnabled = this.configService.get<boolean>('MONGODB_QUERY_LOGGING');

		if (queryLoggingEnabled) {
			mongoose.set('debug', true);
		}

		return {
			uri: mongodbUri,
			useNewUrlParser: true,
			useUnifiedTopology: true
		};
	};
}
