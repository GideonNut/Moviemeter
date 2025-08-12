# TV Series Setup Guide

This guide explains how to use the new TV series functionality in MovieMeter.

## What's New

- **Movie Model Updated**: Added `isTVSeries` boolean field to distinguish between movies and TV series
- **Admin Interface**: Checkbox to mark content as TV series when adding new content
- **TV Shows Page**: Now displays real TV series from the database instead of mocked data
- **Movies Page**: Filters out TV series to show only regular movies
- **TV Show Detail Pages**: Individual pages for each TV series

## How to Use

### 1. Adding TV Series via Admin Panel

1. Go to `/admin` in your application
2. In the "Add Movie" form, you'll see a new checkbox: "This is a TV series"
3. Check this box when adding TV series content
4. Leave it unchecked when adding regular movies

### 2. Content Separation

- **Movies Page** (`/movies`): Shows only content with `isTVSeries: false` (or undefined)
- **TV Shows Page** (`/tv`): Shows only content with `isTVSeries: true`

### 3. Database Structure

The Movie model now includes:
```typescript
{
  title: String,
  description: String,
  posterUrl: String,
  isTVSeries: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

## Testing the Functionality

### Option 1: Use the Admin Panel
1. Navigate to `/admin`
2. Add a new movie with the TV series checkbox checked
3. Add another movie with the checkbox unchecked
4. Check `/movies` and `/tv` to see the separation

### Option 2: Use the Sample Script
1. Make sure your app is running on `http://localhost:3000`
2. Run the sample script:
   ```bash
   node scripts/add-sample-tv-shows.js
   ```
3. This will add 5 sample TV series to test with

## Sample TV Series Included

The sample script adds these popular TV shows:
- The Last of Us (2023)
- House of the Dragon (2022)
- Severance (2022)
- The Bear (2022)
- Shogun (2024)

## Navigation

The header navigation already includes:
- **Movie Votings** → All Movies (regular movies only)
- **TV Shows** → All Shows (TV series only)

## API Endpoints

- `GET /api/movies` - Returns all content (both movies and TV series)
- `POST /api/movies` - Accepts the new `isTVSeries` field
- Filtering happens on the frontend based on the `isTVSeries` field

## Notes

- Existing movies in your database will have `isTVSeries: false` by default
- The TV series checkbox is unchecked by default in the admin form
- Content is automatically sorted by creation date (newest first)
- The system maintains backward compatibility with existing movie data
