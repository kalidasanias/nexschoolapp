use nsa;

alter table school_audios add is_mobile_recording boolean;
alter table school_voice_notifications add is_app_notification boolean;
alter table school_voice_notifications add audio_uuid uuid;
alter table school_voice_notifications add download_link text;
alter table school_voice_notifications add notified_students text;



