declare module "@x402/express" {
  export function paymentMiddleware(routes: any, server: any, paywallConfig?: any): any;
  export class x402ResourceServer {
    constructor(facilitator: any);
    register(network: string, scheme: any): this;
  }
}

declare module "@x402/evm/exact/server" {
  export class ExactEvmScheme {
    constructor();
  }
}

declare module "@x402/core/server" {
  export class HTTPFacilitatorClient {
    constructor(config: { url: string });
  }
}
