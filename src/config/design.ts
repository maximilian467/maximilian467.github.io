// Build-time choice. Rebuild with DESIGN_VARIANT=classic to restore the quiet Laborbuch layout.
export const designVariant = process.env.DESIGN_VARIANT === 'classic' ? 'classic' : 'experiment';
