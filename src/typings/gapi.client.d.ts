declare module 'gapi.client' {
  namespace gapi.client {
    interface CalendarEvent {
      summary: string;
      start: {
        dateTime: string;
        timeZone: string;
      };
      end: {
        dateTime: string;
        timeZone: string;
      };
    }

    interface Calendar {
      events: {
        insert(request: {
          calendarId: string;
          resource: CalendarEvent;
        }): Promise<any>;
      };
    }

    namespace calendar {
      const events: {
        insert(request: {
          calendarId: string;
          resource: CalendarEvent;
        }): Promise<any>;
      };
    }
  }

  namespace gapi.auth {
    function getAuthInstance(): {
      signIn(): Promise<any>;
    };
  }
}
