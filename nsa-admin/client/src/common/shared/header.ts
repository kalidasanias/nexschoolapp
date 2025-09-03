/**
 * Created by senthilPeriyasamy on 12/30/2016.
 */
import { Headers } from '@angular/http';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
// contentHeaders.append('tenant_id', '5e0f5091-cea0-11e6-bc39-318393582c90');
// contentHeaders.append('school_id', '616416');
contentHeaders.append('Content-Type', 'application/json ');
