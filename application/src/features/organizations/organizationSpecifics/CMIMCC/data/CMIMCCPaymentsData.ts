export const stripeProductsDev = {
   "XXIX-Congress-Virtual": {
      productId: "prod_SmHySFkfGcRumv",
      name: "XXIX Congreso Anual De Medicina Interna Costa De Chiapas (Virtual)",
      prices: {
         regular: {
            priceId: "price_1RqjOoELA7TZiqph5BBPh2Vb",
            price: 1500,
            currency: "MXN",
         },
      },
   },
   "XXIX-Congress-In-Person": {
      productId: "prod_SmHJvAywjr6Hgn",
      name: "XXIX Congreso Anual De Medicina Interna Costa De Chiapas (Presencial)",
      prices: {
         regular: {
            priceId: "price_1RqikzELA7TZiqphyftIPh8c",
            price: 2000,
            currency: "MXN",
         },
         "general-medics": {
            priceId: "price_1RqilrELA7TZiqph8y9YZeqy",
            price: 1500,
            currency: "MXN",
         },
         "health-professionals": {
            priceId: "price_1Rqin9ELA7TZiqph9oCEA5pP",
            price: 1000,
            currency: "MXN",
         },
         "students/residents": {
            priceId: "price_1RqincELA7TZiqph7GKzDuwb",
            price: 700,
            currency: "MXN",
         },
         foreigners: {
            priceId: "price_1RqiuTELA7TZiqphu9fo5Nqi",
            price: 70,
            currency: "USD",
         },
      },
   },
   "Recordings-Access": {
      productId: "prod_SmHQxspYbs64QM",
      name: "Acceso a grabaciones del congreso",
      prices: {
         regular: {
            priceId: "price_1RqirTELA7TZiqph7MKArvnv",
            price: 290,
            currency: "MXN",
         },
      },
   },
} as const;

export const stripeProductsProd = {
   "XXIX-Congress-Virtual": {
      productId: "prod_SmukBS5LBwEOAb",
      name: "XXIX Congreso Anual De Medicina Interna Costa De Chiapas (Virtual)",
      prices: {
         regular: {
            priceId: "price_1RrKvMCihEP6yw16uDAEOze8",
            price: 1500,
            currency: "MXN",
         },
      },
   },
   "XXIX-Congress-In-Person": {
      productId: "prod_SmukGiDJSRVRLE",
      name: "XXIX Congreso Anual De Medicina Interna Costa De Chiapas (Presencial)",
      prices: {
         regular: {
            priceId: "price_1RrKvTCihEP6yw1631U4oixS",
            price: 2000,
            currency: "MXN",
         },
         "general-medics": {
            priceId: "price_1RrKvTCihEP6yw16Uzb9m8yj",
            price: 1500,
            currency: "MXN",
         },
         "health-professionals": {
            priceId: "price_1RrKvTCihEP6yw16p1ShZO47",
            price: 1000,
            currency: "MXN",
         },
         "students/residents": {
            priceId: "price_1RrKvTCihEP6yw16IAE3JoWB",
            price: 700,
            currency: "MXN",
         },
         foreigners: {
            priceId: "price_1RrKvTCihEP6yw166pJK4l2c",
            price: 70,
            currency: "USD",
         },
      },
   },
   "Recordings-Access": {
      productId: "prod_SmukSlYSVPAFsp",
      name: "Acceso a grabaciones del congreso",
      prices: {
         regular: {
            priceId: "price_1RrKvQCihEP6yw16lMNaL0Jc",
            price: 290,
            currency: "MXN",
         },
      },
   },
} as const;
