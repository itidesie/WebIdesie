import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/header"
import FooterSection from "@/components/footer-section"
import Link from "next/link"
import { CheckCircle, Clock, Users, BookOpen, Briefcase, GraduationCap, Monitor, Building, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Comparativa Master BIM | IDESIE Business & Technology School",
  description: "¿Qué Master BIM te conviene más? Descubre los mejores Master BIM Manager adaptados a tu perfil",
}

const masters = [
  {
    id: "mbim-fulltime",
    name: "MBIM Full Time",
    popular: true,
    duration: "10+6 meses",
    target: "Jóvenes profesionales recién graduados (<30 años o <3 años exp.)",
    methodology: "Presencial",
    methodologyDetail: "Coaching, Trabajo y Formación",
    content: "Metodología BIM en todas las fases de vida del activo",
    practices: "10 meses + 6 meses prácticas en empresa",
    careers: ["Information Delivery Management", "BIM Design Manager", "BIM Coordination Manager"],
    link: "/mbim-page",
    icon: Building,
  },
  {
    id: "mbbe-fulltime",
    name: "MBBE Full Time",
    popular: false,
    duration: "10+6 meses",
    target: "Jóvenes profesionales recién graduados (<30 años o <3 años exp.)",
    methodology: "Presencial",
    methodologyDetail: "Coaching, Trabajo y Formación",
    content: "BIM aplicado a Instalaciones de Edificación + Gestión de Proyectos",
    practices: "10 meses + 6 meses prácticas en empresa",
    careers: ["BIM Design Manager", "BIM MEP Coordinator", "BIM Project Manager"],
    link: "/mbbe-page",
    icon: Building,
  },
  {
    id: "mbim-online",
    name: "MBIM Online",
    popular: false,
    duration: "Flexible",
    target: "Profesionales que buscan flexibilidad horaria",
    methodology: "Online",
    methodologyDetail: "Videos, tutorías, documentación",
    content: "Metodología BIM en todas las fases de vida del activo",
    practices: "Bolsa de empleo IDESIE Alumni",
    careers: ["Information Delivery Management", "BIM Design Manager", "BIM Coordination Manager"],
    link: "/mbim-online-page",
    icon: Monitor,
  },
  {
    id: "embim-executive",
    name: "eMBIM Executive",
    popular: false,
    duration: "10 meses",
    target: "Profesionales con experiencia del sector AEC",
    methodology: "Presencial",
    methodologyDetail: "Viernes tarde y sábados mañana",
    content: "Metodología BIM con especial atención a definición y dirección de Procesos BIM",
    practices: "Bolsa de empleo IDESIE Alumni",
    careers: ["Information Delivery Management", "BIM Design Manager", "BIM Coordination Manager"],
    link: "/embim-page",
    icon: Calendar,
  },
]

export default function ComparativaMastersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] md:min-h-[100vh] overflow-hidden flex items-center justify-center text-center pt-28 md:pt-32 pb-12">
        <Image
          src="/images/estudiantes_proyecto_grupal.jpg"
          alt="Comparativa de programas Master BIM de IDESIE"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" />
        <div className="relative z-10 text-white px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-snug">
            Comparativa <span className="bg-[#006cff] text-white px-3 py-1 rounded-lg">Master BIM</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Encuentra el programa que mejor se adapta a tu perfil profesional y objetivos de carrera
          </p>
        </div>
      </section>

      {/* Tabla Comparativa Desktop */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          
          {/* Vista Desktop - Tabla */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-gray-200 border-b-2 border-r-2 border-gray-300"></th>
                  {masters.map((master, idx) => (
                    <th key={master.id} className={`p-4 text-center border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''} ${master.popular ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                      <div className="flex flex-col items-center gap-2">
                        {master.popular && (
                          <span className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</span>
                        )}
                        <span className="text-xl font-extrabold">{master.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Duración */}
                <tr>
                  <td className="p-4 bg-white font-bold text-foreground border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Duración
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 text-center bg-white border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      <span className="bg-primary text-white px-3 py-1 rounded font-bold">{master.duration}</span>
                    </td>
                  ))}
                </tr>
                
                {/* Dirigido a */}
                <tr>
                  <td className="p-4 bg-gray-50 font-bold text-foreground border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Dirigido a
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 text-center bg-gray-50 text-muted-foreground text-sm border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      {master.target}
                    </td>
                  ))}
                </tr>
                
                {/* Metodología */}
                <tr>
                  <td className="p-4 bg-white font-bold text-foreground border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Metodología
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 text-center bg-white border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${master.methodology === 'Online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {master.methodology}
                        </span>
                        <span className="text-xs text-muted-foreground">{master.methodologyDetail}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Contenidos */}
                <tr>
                  <td className="p-4 bg-gray-50 font-bold text-foreground border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Contenidos
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 text-center bg-gray-50 text-muted-foreground text-sm border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      {master.content}
                    </td>
                  ))}
                </tr>
                
                {/* Prácticas */}
                <tr>
                  <td className="p-4 bg-white font-bold text-foreground border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Prácticas / Empleo
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 text-center bg-white border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{master.practices}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Salidas Profesionales */}
                <tr>
                  <td className="p-4 bg-gray-50 font-bold text-foreground align-top border-b-2 border-r-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Salidas profesionales
                    </div>
                  </td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 bg-gray-50 align-top border-b-2 border-gray-300 ${idx < masters.length - 1 ? 'border-r-2' : ''}`}>
                      <ul className="space-y-1">
                        {master.careers.map((career, careerIdx) => (
                          <li key={careerIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
                            {career}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                
                {/* CTA */}
                <tr>
                  <td className="p-4 bg-white border-r-2 border-gray-300"></td>
                  {masters.map((master, idx) => (
                    <td key={master.id} className={`p-4 bg-white ${idx < masters.length - 1 ? 'border-r-2 border-gray-300' : ''}`}>
                      <Link href={master.link} scroll={true}>
                        <Button 
                          size="lg" 
                          className={`w-full px-6 py-3 text-sm font-semibold ${master.popular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                        >
                          Mas informacion
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vista Mobile - Cards */}
          <div className="lg:hidden space-y-6">
            {masters.map((master) => {
              const IconComponent = master.icon
              return (
                <div key={master.id} className={`bg-card rounded-2xl shadow-lg overflow-hidden ${master.popular ? 'border-4 border-primary' : 'border-2 border-border'}`}>
                  {master.popular && (
                    <div className="bg-primary text-white text-center py-2 font-bold text-sm uppercase tracking-wider">
                      MÁS POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground">{master.name}</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground">Duración: </span>
                          <span className="bg-primary text-white px-2 py-0.5 rounded text-sm font-semibold">{master.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground">Dirigido a: </span>
                          <span className="text-muted-foreground">{master.target}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground">Metodología: </span>
                          <span className={`px-2 py-0.5 rounded text-sm font-semibold ${master.methodology === 'Online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {master.methodology}
                          </span>
                          <span className="text-muted-foreground text-sm ml-1">({master.methodologyDetail})</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground">Contenidos: </span>
                          <span className="text-muted-foreground">{master.content}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground">Prácticas/Empleo: </span>
                          <span className="text-muted-foreground">{master.practices}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-foreground block mb-2">Salidas profesionales:</span>
                          <ul className="space-y-1">
                            {master.careers.map((career, idx) => (
                              <li key={idx} className="text-muted-foreground text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                {career}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Link href={master.link} scroll={true}>
                      <Button 
                        size="lg" 
                        className={`w-full ${master.popular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                      >
                        Más información
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guía rápida */}
      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-foreground">
            <span className="bg-primary text-white px-3 py-1 rounded">Guía rápida</span> para elegir
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300">
              <h3 className="font-bold text-lg text-foreground mb-3">Si eres recién graduado y quieres experiencia laboral:</h3>
              <p className="text-muted-foreground mb-4">Los programas Full Time (MBIM o MBBE) incluyen prácticas remuneradas en empresa.</p>
              <div className="flex gap-2">
                <span className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold">MBIM Full Time</span>
                <span className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold">MBBE Full Time</span>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300">
              <h3 className="font-bold text-lg text-foreground mb-3">Si trabajas y necesitas flexibilidad:</h3>
              <p className="text-muted-foreground mb-4">El MBIM Online te permite estudiar a tu ritmo sin dejar tu trabajo actual.</p>
              <div className="flex gap-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">MBIM Online</span>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300">
              <h3 className="font-bold text-lg text-foreground mb-3">Si tienes experiencia y buscas especializarte:</h3>
              <p className="text-muted-foreground mb-4">El Executive está diseñado para profesionales del sector AEC con horario de fin de semana.</p>
              <div className="flex gap-2">
                <span className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold">eMBIM Executive</span>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300">
              <h3 className="font-bold text-lg text-foreground mb-3">Si te interesan las instalaciones MEP:</h3>
              <p className="text-muted-foreground mb-4">El MBBE se especializa en BIM aplicado a instalaciones de edificación.</p>
              <div className="flex gap-2">
                <span className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold">MBBE Full Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            ¿Necesitas ayuda para <span className="bg-white text-primary px-2 py-1 rounded">elegir</span>?
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            Nuestro equipo te asesorará de forma personalizada para encontrar el Master BIM que mejor se adapte a tu perfil
          </p>
          <Link href="/contact-page" scroll={true}>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto px-6 py-3 text-sm font-semibold">
              Solicita asesoramiento gratuito
            </Button>
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
