export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,

}

export enum Messages200 {
    ZTLUpdateSuccess = "ZTL aggiornata con successo.",
    VarcoUpdated = "Varco aggiornato con successo"
}

export enum Messages201 {
    ZTLCreationSuccess = "ZTL creata con successo.",
    UserCreateSuccess = "Utente creato con successo",
}

export enum Messages204 {
    VarcoDeleted = "Varco eliminato con successo",
    ZTLDeletionSuccess = "ZTL eliminata con successo",
    TransitDeleted = "Transito eliminato con successo"
}
export enum Messages300 {
    
}

export enum Messages400 {
    //NoAuthHeader = "Bad Request - Nessun header di autorizzazione.",
    //NoTokenJWT = "Bad Request - Nessun JWT.",
    //InvalidTokenJWT = "Forbidden - JWT non valido (chiave errata).",
    //InvalidVehicleType = "Tipo di veicolo non valido.",
    //InvalidTimeRange = "Intervallo di tempo non valido.",
    /*VehicleNotInWhitelist = "Il veicolo non è nella white list.",
    UnsupportedFormat = "Formato non supportato, inserire: pdf o json.",*/
    InvalidDate = "Formato data non valido.",
    //DateRangeInvalid = "La data di fine deve essere successiva alla data di inizio.",
    NegativeTokens = "Il numero di token non può essere negativo.",
    //MissingFields = "Campi obbligatori mancanti.",
    //InvalidPlateNumber = "Numero di targa non valido.",
    //InvalidFineAmount = "Importo della multa non valido.",
    //NoTransits = "Nessun transito trovato per i criteri specificati.",
    //InvalidStatsRequest = "Richiesta di statistiche non valida.",
    //InvalidQrCode = "QR code non valido.",
    //EmailAlreadyExists = "L'email inserita è già in uso.",
    //InvalidEmailFormat = "Formato dell'email non valido.",
    //InvalidPasswordFormat = "Formato della password non valido.",
    //UnauthorizedRole = "Ruolo utente non autorizzato per questa operazione.",
    //VehicleAlreadyExists = "Il veicolo con la targa specificata esiste già.",
    //InvalidRole = "Ruolo utente non valido.",
    InvalidTransitType = "Tipo di transito non valido (deve essere 'Ingresso' o 'Uscita').",
    NotANumber = "Il valore inserito deve essere numerico.",
    IsANumber = "Il valore inserito non deve essere numerico.",
    //NoTokens = "Tokens insufficienti per creare il grafo, contattare l\'admin",
    //InvalidToken = "I Token inseriti devono essere dei valori double compresi tra 0 e 1000",
    EmailCheck = "Il formato dell'email inserita non è corretto.",
    PasswordCheck = "La password deve contenere almeno 8 caratteri ed un numero, un carattere speciale, un carattere maiuscolo o minuscolo.",
    //SameUser = "Non puoi creare lo stesso utente più volte.",
    //DateString = "La data deve essere una stringa.",
    //InvalidDateReverse = "La data di fine deve precedere quella di inizio.",
    //FormatString = "Il formato deve essere una stringa.",
    EmailEmpty = "L\'email non può essere vuota.",
    PasswordEmpty = "La password non può essere vuota.",
    //TokensEmpty = "Il valore dei token non può essere vuoto.",
    InvalidDateFormat = "Le date sono state inserite in maniera errata.",
    //UpdateRequestNotFound = "Non ci sono richieste per te.",
    //UpdateNotFound = "Non ci sono update con questo ID.",
    //UpdateAlreadyAwnsered = "Non puoi modificare un update a cui già hai risposto.",
    //NoStoric = "Non c'è uno storico di richieste per te.",
    //AllRequestAlreadyAwnsered = "Non ci sono richieste di aggiornamento pendenti per te.",
    //NoTokensUpdate = "Non hai abbastanza tokens per fare l'upgrade.",
    PasswordNotMatch = "La password inserita non corrisponde a quella nel database.",
    //UpdateNotDifferent = "Non puoi accettare o rifiutare la stessa richiesta di aggiornamento.",
    //UpdateAnswerValidation = "La risposta deve essere true o false.",
    //RequestNotFound = "Body non valido, inserisci almeno l'ID Upgrade di una richiesta.",
    //DescriptionValidation = "La descrizione non può essere più lunga di 150 caratteri.",
    //NameValidaton = "Il nome non può essere più lungo di 50 caratteri e più corto di un carattere.",
    //BadFormat= "Il formato del body non è corretto. Controlla bene i dati inseriti.",
    //DescriptionString = "La descrizione deve essere una stringa.",
    //DescriptionLenghtLimit = "La descrizione non può superare i 150 caratteri.",
    //InvalidId = "L'id deve essere un numero",
    //IsActiveMancante = "Il parametro is_active deve essere presente e deve essere booleano",
    //NomeMancante = "Nome non presente",
    //CampiMancantiTransito = "CampiMancantiTransito",
    //CampiMancantiTransitoStato = "CampiMancantiTransitoStato",
    //InvalidName = "InvalidName",
    //InvalidIsActive = "InvalidIsActive",


    CampiMancantiVarco = "Assicurati di inserire correttamente tutti i parametri nome, ztl_id, orario_apertura, orario_chiusura",
    OrarioNonValido = "L'orario deve essere scritto nel formato hh:mm:ss",
    OrarioChiusuraNonValido = "L'orario di chiusura deve essere successivo all'orario di apertura",
    CampiMancantiZtl = "Assicurati di inserire tutti i parametri: nome, is_active",
    //MissingTransitFields = "Assicurati di inserire correttamente tutti i parametri: targa_veicolo, pedaggio, varco_id e ingresso_uscita"
    TransitMissingParams = "Assicurati di inserire correttamente tutti i parametri: targa_veicolo, pedaggio, varco_id e ingresso_uscita",
    InvalidFormatType = "Il formato deve essere o json o pdf",
    InvalidTargheFormat = "La targa deve essere una stringa",
    GetTransitMissingParams = "Assicurati di inserire correttamente tutti i parametri: targa, startDate, endDate, format",
    //InvalidTargaFormat = "InvalidTargaFormat",
    MissingOrInvalidVarcoId = "L'id del varco è nullo o invalido",
    InvalidStartDateFormat = "La data d'inizio non è valida",
    InvalidEndDateFormat = "La data di fine non è valida",
    EndDateNotAfterStartDate = 'La data di fine deve essere successiva alla data di inizio.'
}

export enum Messages404{
    MultaNotFound = "Multa non trovata",
    ZTLNotFound = "ZTL non trovata",
    VarcoNotFound = "Varco non trovato",
    UserNotFound = "Utente non trovato",
    TransitNotFound = "Transito non trovato",
    WhitelistNotFound = "Whitelist non trovata",
    VehicleNotFound = "Veicolo non trovato"

}

export enum Messages401{
    UnauthorizedUser = "Utente non autorizzato",
    UserAlreadyExist = "L'utente esiste già"

}

export enum Messages500 {
    InternalServerError = "Errore interno del server.",
    /*
    UnableToGenerateFile = "Impossibile generare il file PDF/JSON.",
    ImpossibileCreation = "Non è possibile creare la risorsa.",
    ErrorCalculatingFine = "Errore durante il calcolo della multa.",
    DatabaseError = "Errore nel database.",
    ErrorSendingEmail = "Errore nell'invio dell'email.",
    ErrorProcessingRequest = "Errore nell'elaborazione della richiesta."
    */
}
