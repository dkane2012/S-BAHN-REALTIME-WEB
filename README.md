# Munich S-Bahn Schedule App Specification

## Overview
A web application that provides real-time schedule information for specific Munich S-Bahn lines (S3 and S4) for commuting between home and work.

## Core Features

### Morning Commute (Home to Work)
- Display next departures for:
  - S3 from München-Langwied to München-Laim
  - S4 from München-Leienfelsstraße to München-Laim
- Show recommended departure time from home (10 minutes before train departure)

### Evening Commute (Work to Home)
- Display next departures for:
  - S3 from München-Laim to München-Langwied
  - S4 from München-Laim to München-Leienfelsstraße
- Show recommended departure time from work (10 minutes before train departure)

### Time Detection
- Automatically determine if user needs morning or evening schedule based on time of day
- Allow manual toggle between morning/evening views

## Technical Requirements

### Data Source
- Integration with München S-Bahn API or DB (Deutsche Bahn) API
- Real-time schedule updates including delays

### Frontend
- Mobile-first responsive design
- Simple, clean interface showing only essential information
- Clear visual indication of next train and countdown

## Future Enhancements
- Custom address input to replace fixed 10-minute walking time
- Walking distance calculation using Google Maps or similar API
- Personalized notifications for delays

## Success Criteria
- Updates train schedules automatically
- Clearly shows "leave by" time for catching next train
- Works on both mobile and desktop browsers