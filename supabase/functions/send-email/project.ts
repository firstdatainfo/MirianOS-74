export const project = {
  id: 'axdkgkyfxhuinfoglggv',
  name: 'MirianOS',
  storage: {
    buckets: {
      orcamentos: {
        public: true,
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
      }
    }
  }
};
