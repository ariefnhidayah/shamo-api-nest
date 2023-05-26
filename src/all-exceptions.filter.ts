import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        try {
            let status = HttpStatus.INTERNAL_SERVER_ERROR
            if (typeof exception.getStatus == 'function') {
                status = exception.getStatus()
            }

            if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
                console.log(exception.message)
            }

            response
                .status(status)
                .json({
                    success: false,
                    message: status == HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal Server Error!' : exception.cause != null ? exception.cause.message : exception.message,
                    data: exception.cause != null ? exception.getResponse() : null,
                });
        } catch (error) {
            console.warn(error)
            response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    success: false,
                    message: "Internal Server Error!",
                    data: null,
                });
        }
    }
}