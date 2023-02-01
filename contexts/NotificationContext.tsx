import React, { useContext, useState } from 'react';

interface followUser {}

interface scheduleUser {
    pk: number;
    username: string;
    email: string;
}

interface followRequestData {}

interface scheduleRequestData {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    protection_level: number;
    participants: scheduleUser[];
}
