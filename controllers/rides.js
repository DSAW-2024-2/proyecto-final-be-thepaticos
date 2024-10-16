import { validationErrors } from '../errors/CustomErrors.js';
import { formatZodErrors, rideSchema } from '../lib/validators.js';
import ridesModel from '../models/rides.js';

class rideController {
  static async getRides(req, res, next) {
    try {
      const rides = await ridesModel.getAllRides();
      res.status(200).json({ rides: rides });
    } catch (error) {
      next(error);
    }
  }
  static async postRide(req, res, next) {
    try {
      const rideData = req.body;
      const validData = rideSchema.safeParse(rideData);
      const isValid = validationErrors(validData, res);
      if (isValid !== true) return;
      const rideId = await ridesModel.createRide(rideData);
      res.status(200).json({
        message: 'Ride creado correctamente',
        ride: { rideId: rideId, ...rideData },
      });
    } catch (error) {
      if (error.message === 'VehicleNotFound') {
        return res
          .status(400)
          .json({ message: 'No existe un vehiculo con esa placa' });
      }

      next(error);
    }
  }
  static async getRide(req, res) {
    res.status(200).json({
      ride: req.ride,
    });
  }
  static async deleteRide(req, res, next) {
    try {
      const { id } = req.params;
      await ridesModel.deleteRide(id);
      res.status(200).json({
        message: 'Ride eliminado correctamente',
      });
    } catch (error) {
      if (error.message === 'RideHaveActivePassengers') {
        return res.status(409).json({
          message:
            'El ride no puede eliminarse porque tiene pasajeros asociados',
        });
      }
      next(error);
    }
  }
  static async recommendedFee(req, res, next) {
    try {
      const { startPoint, endPoint } = req.query;
    } catch (error) {
      next(error);
    }
  }
  static async startRoutes(req, res, next) {
    try {
      const origins = await ridesModel.getStartingPoints();
      res.status(200).json({
        origins: origins,
      });
    } catch (error) {
      next(error);
    }
  }
  static async endRoutes(req, res, next) {
    try {
      const destinations = await ridesModel.getEndingPoints();
      res.status(200).json({
        destinations: destinations,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default rideController;
