import {Injectable} from '@angular/core';
import {DbCalendar} from 'src/app/data/db';
import {ObjectFormService} from 'src/app/shared/object-form-service';

@Injectable()
export class AssignmentFormService extends ObjectFormService<DbCalendar[]> {}
