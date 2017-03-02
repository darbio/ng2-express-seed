let uuid = require('uuid');

export interface IDomainEvent {
  id: string;
  eventId: string;
}

export abstract class DomainEvent implements IDomainEvent {
  id: string = uuid.v4();
  abstract eventId: string;
}

export class SendEmailDomainEvent extends DomainEvent {
  static eventId = 'events:v1:email:send';
  eventId: string = SendEmailDomainEvent.eventId;

  to: string;

  constructor(to: string) {
    super();

    this.to = to;
  }
}
