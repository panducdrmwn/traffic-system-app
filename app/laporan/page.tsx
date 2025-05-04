"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon, Download, FileText, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LaporanPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [lalinData, setLalinData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchLalinData()
  }, [date])

  const fetchLalinData = async () => {
    setIsLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await fetch(`http://localhost:8080/api/lalins?tanggal=${formattedDate}`)

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await response.json()
      setLalinData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Use mock data for demonstration
      setLalinData(getMockData())
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for demonstration
  const getMockData = () => {
    return {
      tunai: [
        { id: 1, gerbang: "Gerbang A", shift: "1", jumlah: 120, tanggal: "2023-11-01" },
        { id: 2, gerbang: "Gerbang B", shift: "1", jumlah: 85, tanggal: "2023-11-01" },
        { id: 3, gerbang: "Gerbang C", shift: "2", jumlah: 95, tanggal: "2023-11-01" },
        { id: 4, gerbang: "Gerbang D", shift: "2", jumlah: 110, tanggal: "2023-11-01" },
        { id: 5, gerbang: "Gerbang E", shift: "3", jumlah: 75, tanggal: "2023-11-01" },
      ],
      etoll: [
        { id: 6, gerbang: "Gerbang A", shift: "1", jumlah: 250, tanggal: "2023-11-01", bank: "BCA" },
        { id: 7, gerbang: "Gerbang B", shift: "1", jumlah: 180, tanggal: "2023-11-01", bank: "BRI" },
        { id: 8, gerbang: "Gerbang C", shift: "2", jumlah: 220, tanggal: "2023-11-01", bank: "BNI" },
        { id: 9, gerbang: "Gerbang D", shift: "2", jumlah: 195, tanggal: "2023-11-01", bank: "Mandiri" },
        { id: 10, gerbang: "Gerbang E", shift: "3", jumlah: 160, tanggal: "2023-11-01", bank: "DKI" },
      ],
      flo: [
        { id: 11, gerbang: "Gerbang A", shift: "1", jumlah: 45, tanggal: "2023-11-01" },
        { id: 12, gerbang: "Gerbang B", shift: "1", jumlah: 35, tanggal: "2023-11-01" },
        { id: 13, gerbang: "Gerbang C", shift: "2", jumlah: 50, tanggal: "2023-11-01" },
        { id: 14, gerbang: "Gerbang D", shift: "2", jumlah: 40, tanggal: "2023-11-01" },
        { id: 15, gerbang: "Gerbang E", shift: "3", jumlah: 30, tanggal: "2023-11-01" },
      ],
      ktp: [
        { id: 16, gerbang: "Gerbang A", shift: "1", jumlah: 25, tanggal: "2023-11-01" },
        { id: 17, gerbang: "Gerbang B", shift: "1", jumlah: 20, tanggal: "2023-11-01" },
        { id: 18, gerbang: "Gerbang C", shift: "2", jumlah: 30, tanggal: "2023-11-01" },
        { id: 19, gerbang: "Gerbang D", shift: "2", jumlah: 15, tanggal: "2023-11-01" },
        { id: 20, gerbang: "Gerbang E", shift: "3", jumlah: 10, tanggal: "2023-11-01" },
      ],
      summary: {
        totalTunai: 485,
        totalEtoll: 1005,
        totalFlo: 200,
        totalKTP: 100,
        totalKeseluruhan: 1790,
        totalEtollTunaiFlo: 1690,
      },
    }
  }

  const handleReset = () => {
    setSearchQuery("")
    setDate(new Date())
  }

  const handleExport = () => {
    alert("Mengekspor data laporan...")
    // Implement export functionality here
  }

  const handleShowDetail = (type: string, detail: any) => {
    setSelectedDetail({
      type,
      ...detail,
    })
    setShowDetailDialog(true)
  }

  const filteredData = () => {
    if (!lalinData) return { tunai: [], etoll: [], flo: [], ktp: [] }

    const filterBySearch = (item: any) => {
      if (!searchQuery) return true

      const searchLower = searchQuery.toLowerCase()
      return (
        item.gerbang.toLowerCase().includes(searchLower) ||
        item.shift.toString().includes(searchLower) ||
        item.jumlah.toString().includes(searchLower)
      )
    }

    return {
      tunai: lalinData.tunai.filter(filterBySearch),
      etoll: lalinData.etoll.filter(filterBySearch),
      flo: lalinData.flo.filter(filterBySearch),
      ktp: lalinData.ktp.filter(filterBySearch),
    }
  }

  const paginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = (data: any[]) => {
    return Math.ceil(data.length / itemsPerPage)
  }

  const renderPagination = (data: any[]) => {
    const total = totalPages(data)
    if (total <= 1) return null

    return (
      <div className="flex justify-center mt-4 gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, total))}
          disabled={currentPage === total}
        >
          Next
        </Button>
      </div>
    )
  }

  const filtered = filteredData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>

          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Total Tunai</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalTunai}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Total E-Toll</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalEtoll}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Total Flo</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalFlo}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Total KTP</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalKTP}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">E-Toll+Tunai+Flo</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalEtollTunaiFlo}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Total Keseluruhan</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold">{lalinData.summary.totalKeseluruhan}</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="tunai">Tunai</TabsTrigger>
              <TabsTrigger value="etoll">E-Toll</TabsTrigger>
              <TabsTrigger value="flo">Flo</TabsTrigger>
              <TabsTrigger value="ktp">KTP</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Semua Data Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Gerbang</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ...paginatedData([
                          ...filtered.tunai.map((item) => ({ ...item, jenis: "Tunai" })),
                          ...filtered.etoll.map((item) => ({ ...item, jenis: "E-Toll" })),
                          ...filtered.flo.map((item) => ({ ...item, jenis: "Flo" })),
                          ...filtered.ktp.map((item) => ({ ...item, jenis: "KTP" })),
                        ]),
                      ].map((item) => (
                        <TableRow key={`${item.jenis}-${item.id}`}>
                          <TableCell>{item.jenis}</TableCell>
                          <TableCell>{item.gerbang}</TableCell>
                          <TableCell>{item.shift}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShowDetail(item.jenis.toLowerCase(), item)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination([...filtered.tunai, ...filtered.etoll, ...filtered.flo, ...filtered.ktp])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tunai">
              <Card>
                <CardHeader>
                  <CardTitle>Data Laporan Tunai</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gerbang</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData(filtered.tunai).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.gerbang}</TableCell>
                          <TableCell>{item.shift}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleShowDetail("tunai", item)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(filtered.tunai)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="etoll">
              <Card>
                <CardHeader>
                  <CardTitle>Data Laporan E-Toll</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gerbang</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData(filtered.etoll).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.gerbang}</TableCell>
                          <TableCell>{item.shift}</TableCell>
                          <TableCell>{item.bank}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleShowDetail("etoll", item)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(filtered.etoll)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flo">
              <Card>
                <CardHeader>
                  <CardTitle>Data Laporan Flo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gerbang</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData(filtered.flo).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.gerbang}</TableCell>
                          <TableCell>{item.shift}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleShowDetail("flo", item)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(filtered.flo)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ktp">
              <Card>
                <CardHeader>
                  <CardTitle>Data Laporan KTP</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gerbang</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData(filtered.ktp).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.gerbang}</TableCell>
                          <TableCell>{item.shift}</TableCell>
                          <TableCell>{item.jumlah}</TableCell>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleShowDetail("ktp", item)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(filtered.ktp)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Laporan</DialogTitle>
            <DialogDescription>Informasi detail untuk data yang dipilih</DialogDescription>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Jenis</p>
                  <p className="text-sm">
                    {selectedDetail.type === "etoll"
                      ? "E-Toll"
                      : selectedDetail.type === "tunai"
                        ? "Tunai"
                        : selectedDetail.type === "flo"
                          ? "Flo"
                          : "KTP"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gerbang</p>
                  <p className="text-sm">{selectedDetail.gerbang}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shift</p>
                  <p className="text-sm">{selectedDetail.shift}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Jumlah</p>
                  <p className="text-sm">{selectedDetail.jumlah}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tanggal</p>
                  <p className="text-sm">{selectedDetail.tanggal}</p>
                </div>
                {selectedDetail.type === "etoll" && (
                  <div>
                    <p className="text-sm font-medium">Bank</p>
                    <p className="text-sm">{selectedDetail.bank}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
