import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

type GoogleMapsBootstrap = {
  Map?: unknown;
  importLibrary?: (libraryName: string, ...options: unknown[]) => Promise<unknown>;
  __ib__?: () => void;
};

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private scriptPromise: Promise<void> | undefined;
  private readonly requestedLibraries = new Set<string>();

  async load(): Promise<void> {
    const maps = this.getGoogleMapsNamespace();

    if (maps.Map) {
      return;
    }

    if (!maps.importLibrary) {
      this.installGoogleMapsBootstrapLoader(maps);
    }

    await maps.importLibrary?.('maps');
  }

  private getGoogleMapsNamespace(): GoogleMapsBootstrap {
    const googleWindow = window as Window & {
      google?: { maps?: GoogleMapsBootstrap };
    };

    googleWindow.google ??= {};
    googleWindow.google.maps ??= {};

    return googleWindow.google.maps;
  }

  private installGoogleMapsBootstrapLoader(maps: GoogleMapsBootstrap) {
    const bootstrapImportLibrary = (libraryName: string, ...options: unknown[]) => {
      this.requestedLibraries.add(libraryName);

      this.scriptPromise ??= new Promise<void>((resolve, reject) => {
        const scriptUrl = this.createScriptUrl();

        const script = document.createElement('script');
        script.src = scriptUrl.toString();
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          script.remove();
          this.scriptPromise = undefined;
          reject(
            new Error(
              `Google Maps JavaScript API could not load. Failed request: ${this.sanitizeScriptUrl(scriptUrl)}`,
            ),
          );
        };

        maps.__ib__ = resolve;
        document.head.append(script);
      });

      return this.scriptPromise.then(() => {
        if (maps.importLibrary === bootstrapImportLibrary) {
          this.scriptPromise = undefined;
          throw new Error('Google Maps importLibrary was not installed by the API script.');
        }

        return maps.importLibrary?.(libraryName, ...options) ?? Promise.resolve();
      });
    };

    maps.importLibrary = bootstrapImportLibrary;
  }

  private createScriptUrl(): URL {
    const scriptUrl = new URL('https://maps.googleapis.com/maps/api/js');
    scriptUrl.search = new URLSearchParams({
      key: environment.googleMapsApiKey,
      v: 'weekly',
      loading: 'async',
      libraries: [...this.requestedLibraries].join(','),
      callback: 'google.maps.__ib__',
    }).toString();

    return scriptUrl;
  }

  private sanitizeScriptUrl(scriptUrl: URL): string {
    const sanitizedUrl = new URL(scriptUrl);
    sanitizedUrl.searchParams.set('key', '[redacted]');

    return sanitizedUrl.toString();
  }
}
