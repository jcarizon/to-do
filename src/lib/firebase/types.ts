// For user document structure and related types
export interface IUserDocument {
  email: string;
  displayName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  uid: string;
  data: IUserDocument;
}

// For board document structure and related types
export interface IBoardDocumentBase {
  uid: string;
  boardId: string;
}

export interface ICreateBoardDocument extends IBoardDocumentBase {
  title: string;
}

export interface IUpdateBoardDocument extends IBoardDocumentBase {
  columnOrder: string[];
}

// For column document structure and related types
export interface ICreateColumnDocument extends IBoardDocumentBase {
  columnId: string;
  data: object;
}

export interface IDeleteColumnDocument extends IBoardDocumentBase {
  columnId: string;
}

// For ticket document structure and related types
export interface ICreateTicketDocument extends IBoardDocumentBase {
  ticketId: string;
  data: object;
}

export interface IUpdateTicketDocument extends IBoardDocumentBase {
  ticketId: string;
  data: object;
}

export interface IDeleteTicketDocument extends IBoardDocumentBase {
  ticketId: string;
}

// For history document structure and related types
export interface IAppendBoardHistoryEventDocument extends IBoardDocumentBase {
  event: object;
}

export interface IAppendTicketHistoryEventDocument extends IBoardDocumentBase {
  ticketId: string;
  event: object;
}

export interface ITicketHistoryDocument extends IBoardDocumentBase {
  ticketId: string;
}