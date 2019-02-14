from lib.rpi_audio_levels import AudioLevels


# We will give chunks of 2**11 audio samples
DATA_SIZE = 11
# We want to extract levels for 6 frequency bands
BANDS_COUNT = 6
# Preliminary call to prepare things
audio_levels = AudioLevels(DATA_SIZE, BANDS_COUNT)

# Example of 6 arbitrary frequency bands. Indexes must be between 0 and 2**(DATA_SIZE - 1).
bands_indexes = [[0,100], [100,200], [200,600], [600,700], [700,800], [800,1024]]
# (Here the indexes come from nowhere, but you could have some algorithm to convert
# start/end frequencies of each band you want to their corresponding indexes within
# the FFT data)

# Then retrieve audio levels each time you have new data.
window = hanning(len(data)).astype(float32)
data = data * window
levels, means, stds = audio_levels.compute(data, bands_indexes)
