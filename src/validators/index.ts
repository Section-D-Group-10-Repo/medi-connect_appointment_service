import * as z from "zod";

import * as appointmentValidator from "./appointment.validator";

const queryParamIDValidator = (
  message = "Query param ID not provided or invalid."
) => {
  return z.object({
    id: z
      .string({
        message,
      })
      .min(1, { message }),
  });
};

export { appointmentValidator, queryParamIDValidator };
